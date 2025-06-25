<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\IntraController;
use App\Service\JwtService;
use App\Service\MailService;
use App\Form\RegistrationForm;
use App\Message\SendActivationMessage;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class RegistrationController extends AbstractController
{
    
    #[Route('/register', name: 'app_register', methods: ['GET', 'POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $userPasswordHasher,
        ValidatorInterface $validator,
        JwtService $jwtService,
        MailService $mailService,
        IntraController $intraController,
        MessageBusInterface $messageBus,
        EntityManagerInterface $entityManager
    ): Response {
        $user = new User();
        $form = $this->createForm(RegistrationForm::class, $user);
        $form->handleRequest($request);

        if ($request->isMethod('POST')) {
            $errors = $validator->validate($request);
            if (count($errors) > 0) {
                return $this->render('registration/register.html.twig', [
                    'registrationForm' => $form->createView(),
                    'errors' => $errors
                ]);
            }
        }

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var string $plainPassword */
            $plainPassword = $form->get('plainPassword')->getData();

            // encode the plain password
            $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword))
                ->setRoles(['ROLE_USER']);
            try {
                $entityManager->persist($user);
                $entityManager->flush();
                $header = ['typ' => 'JWT', 'alg' => 'HS256'];
                $payload = ['user_id' => $user->getId()];
                $token = $jwtService->generate($header, $payload, $this->getParameter('app.jwtsecret'));
                $url = $this->generateUrl('check_user',['token'=>$token],UrlGeneratorInterface::ABSOLUTE_URL);
                $messageBus->dispatch(new SendActivationMessage($intraController->getWebmaster(), $user->getEmail(), 'Activation de votre compte', 'register', ['user' => $user, 'url' => $url]));
                return $this->redirectToRoute('app_main');
            } catch (EntityNotFoundException $e) {
                return $this->redirectToRoute('app_error', ['exception' => $e]);
            }
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView()
        ]);
    }

    #[Route('/check/{token}', name: 'check_user')]
    public function verifyUser($token, JWTService $jwt, UserRepository $userRepository, EntityManagerInterface $em): Response
    {
        //if token valid, expired & !modified
        if ($jwt->isValid($token) && !$jwt->isExpired($token) && $jwt->check($token, $this->getParameter('app.jwtsecret'))) {

            $payload = $jwt->getPayload($token);

            //user token
            $user = $userRepository->find($payload['user_id']);

            if ($user && !$user->IsVerified()) {
                $user->setIsVerified(true);
                $em->persist($user);
                $em->flush();

                $this->addFlash('alert-success', 'Utilisateur activé');
                return $this->redirectToRoute('app_login');
            }
        }

        $this->addFlash('alert-danger', 'Le token est invalide ou a expiré');
        return $this->redirectToRoute('app_login');
    }



    #[Route('/renvoiverif', name: 'resend_verif')]
    public function resendVerif(JWTService $jwt, MailService $mail, IntraController $intraController): Response
    {
        $user = $this->getUser();

        if (!$user) {
            $this->addFlash('alert-danger', 'Vous devez être connecté pour accéder à cette page');
            return $this->redirectToRoute('app_login');
        }

        if ($user->IsVerified() === true) {
            $this->addFlash('alert-warning', 'Cet utilisateur est déjà activé');
            return $this->redirectToRoute('profile_index');
        }

        // On génère le JWT de l'utilisateur
        // On crée le Header
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        // On crée le Payload
        $payload = [
            'user_id' => $user->getId()
        ];

        // On génère le token
        $token = $jwt->generate($header, $payload, $this->getParameter('app.jwtsecret'));

        // On envoie un mail
        $mail->sendMail(
            $intraController->getWebmaster(),
            $user->getEmail(),
            'Activation de votre compte sur le site',
            'register',
            ['user' => $user, 'token' => $token]
        );
        $this->addFlash('alert-success', 'Email de vérification envoyé');
        return $this->redirectToRoute('app_main');
    }
}
