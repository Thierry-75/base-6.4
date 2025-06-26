<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\JwtService;
use App\Form\RegistrationForm;
use App\Service\IntraController;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationController extends AbstractController
{

    #[Route('/register', name: 'app_register', methods: ['GET', 'POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $userPasswordHasher,
        ValidatorInterface $validator,
        JwtService $jwtService,
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
            // encode password
            $user->setPassword($userPasswordHasher->hashPassword($user, $form->get('plainPassword')->getData()))
                ->setRoles(['ROLE_USER']);
            try {
                $entityManager->persist($user);
                $entityManager->flush();
                $subject = 'Activation de votre compte';
                $destination = 'check_user';
                $nomTemplate = 'register';
                $intraController->emailValidate($user, $jwtService, $messageBus,$destination,$subject,$nomTemplate);
                $this->addFlash('alert-warning', 'Vous devez confirmer votre adresse email');
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
                $user->setIsVerified(true)
                    ->setIsNewsLetter(true);
                $em->persist($user);
                $em->flush();

                $this->addFlash('alert-success', 'Utilisateur activé');
                return $this->redirectToRoute('app_login');
            }
        }
        $this->addFlash('alert-danger', 'Le token est invalide ou a expiré');
        return $this->redirectToRoute('app_login');
    }
}
